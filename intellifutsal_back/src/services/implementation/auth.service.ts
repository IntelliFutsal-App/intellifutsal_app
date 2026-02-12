import { loginUserSchema, logoutSchema, refreshTokenSchema, registerUserSchema } from "../../dto";
import { ConflictException, InternalServerException, UnauthorizedException } from "../../exceptions";
import { RegisterUserRequest, AuthUserResponse, LoginUserRequest, RefreshTokenRequest, LogoutUserRequest } from "../../interfaces";
import { AuthMapper, RefreshTokenMapper, UserMapper } from "../../mappers";
import { CredentialRepository, RefreshTokenRepository } from "../../repository";
import { INCORRECT_CREDENTIALS, INTERNAL_SERVER_ERROR, JWT_INVALID_OR_EXPIRED, JWT_NOT_PROVIDED, USER_EMAIL_ALREADY_EXISTS, USER_SAVE_ERROR } from "../../utilities/messages.utility";
import { validateRequest } from "../../utilities/validations.utility";
import { IAuthService } from "../auth.service.interface";
import * as bcrypt from "bcryptjs";
import { JwtService } from "./jwt.service";


export class AuthService implements IAuthService {
    private readonly credentialRepository: CredentialRepository;
    private readonly refreshTokenRepository: RefreshTokenRepository;
    private readonly jwtService: JwtService;

    constructor() {
        this.credentialRepository = new CredentialRepository();
        this.refreshTokenRepository = new RefreshTokenRepository();
        this.jwtService = new JwtService();
    }

    public register = async (registerUserRequest: RegisterUserRequest): Promise<AuthUserResponse> => {
        await this.ensureEmailIsUnique(registerUserRequest.email);
        const validatedRequest = validateRequest(registerUserSchema, registerUserRequest);

        const passwordHashed = await bcrypt.hash(validatedRequest.password, 10);
        const user = UserMapper.toEntity(validatedRequest, passwordHashed);
        const savedUser = await this.credentialRepository.save(user);
        if (!savedUser) throw new InternalServerException(`${INTERNAL_SERVER_ERROR} ${USER_SAVE_ERROR}`);

        const userResponse = UserMapper.toResponse(savedUser);

        const accessToken = this.jwtService.generateAccessToken(userResponse);
        const refreshToken = this.jwtService.generateRefreshToken(userResponse);

        await this.saveRefreshToken(savedUser.id, refreshToken);

        return AuthMapper.toResponse(
            userResponse,
            accessToken,
            refreshToken,
            this.jwtService.getType(),
            this.jwtService.getAccessExpirationInSeconds(),
        );
    };

    public login = async (loginUserRequest: LoginUserRequest): Promise<AuthUserResponse> => {
        const validatedRequest = validateRequest(loginUserSchema, loginUserRequest);
        const user = await this.findUserOrThrow(validatedRequest.email);

        const isPasswordValid = await bcrypt.compare(
            validatedRequest.password.toString(),
            user.password.toString(),
        );
        if (!isPasswordValid) throw new UnauthorizedException(`${INCORRECT_CREDENTIALS}`);

        const userResponse = UserMapper.toResponse(user);

        const accessToken = this.jwtService.generateAccessToken(userResponse);
        const refreshToken = this.jwtService.generateRefreshToken(userResponse);

        await this.saveRefreshToken(user.id, refreshToken);

        return AuthMapper.toResponse(
            userResponse,
            accessToken,
            refreshToken,
            this.jwtService.getType(),
            this.jwtService.getAccessExpirationInSeconds(),
        );
    };

    public validateToken = async (authHeader: string): Promise<any> => {
        if (!authHeader || !authHeader.startsWith("Bearer ")) throw new UnauthorizedException(JWT_NOT_PROVIDED);

        const token = authHeader.split(" ")[1];
        const decoded = this.jwtService.verifyAccessToken(token);

        if (!decoded) throw new UnauthorizedException(JWT_INVALID_OR_EXPIRED);

        return AuthMapper.toValidateTokenResponse(true, decoded);
    };

    public refreshToken = async (refreshTokenRequest: RefreshTokenRequest): Promise<AuthUserResponse> => {
        const validatedRequest = validateRequest(refreshTokenSchema, refreshTokenRequest);
        this.jwtService.verifyRefreshToken(validatedRequest.refreshToken);

        const stored = await this.refreshTokenRepository.findActiveByToken(validatedRequest.refreshToken);
        if (!stored || stored.expiresAt < new Date()) {
            throw new UnauthorizedException(JWT_INVALID_OR_EXPIRED);
        }

        const userResponse = UserMapper.toResponse(stored.credential);
        const newAccessToken = this.jwtService.generateAccessToken(userResponse);
        const newRefreshToken = this.jwtService.generateRefreshToken(userResponse);

        await this.refreshTokenRepository.revoke(validatedRequest.refreshToken);
        await this.saveRefreshToken(stored.credential.id, newRefreshToken);

        return AuthMapper.toResponse(
            userResponse,
            newAccessToken,
            newRefreshToken,
            this.jwtService.getType(),
            this.jwtService.getAccessExpirationInSeconds(),
        );
    };

    public logout = async (logoutUserRequest: LogoutUserRequest): Promise<void> => {
        const validatedRequest = validateRequest(logoutSchema, logoutUserRequest);

        await this.refreshTokenRepository.revoke(validatedRequest.refreshToken);
    };

    private ensureEmailIsUnique = async (email: string): Promise<void> => {
        const existingUser = await this.credentialRepository.findByEmail(email);

        if (existingUser) throw new ConflictException(`${USER_EMAIL_ALREADY_EXISTS}${email}`);
    };

    private findUserOrThrow = async (email: string): Promise<any> => {
        const user = await this.credentialRepository.findByEmail(email);

        if (!user) throw new UnauthorizedException(`${INCORRECT_CREDENTIALS}`);

        return user;
    };

    private saveRefreshToken = async (credentialId: number, token: string): Promise<void> => {
        const decoded = this.jwtService.verifyRefreshToken(token);
        const exp = (decoded as any).exp;

        const expiresAt = new Date(exp * 1000);
        const refreshToken = RefreshTokenMapper.toEntity(credentialId, token, expiresAt);

        await this.refreshTokenRepository.save(refreshToken);
    };
}