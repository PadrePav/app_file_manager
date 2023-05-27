import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import * as request from "supertest";
import {AppModule} from "../src/app.module";
import AuthSignupDto from "../src/auth/dto/authSignupDto";

export let token = ''

describe('Auth', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Sign-up (creating new user', () => {
    it('should create new user', () => {
      const dto: AuthSignupDto = {
        userName: 'test',
        password: 'testPassword'
      };
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(201);
    });

    it('should return 400 (user exist)', () => {
      const dto: AuthSignupDto = {
        userName: 'test',
        password: 'testPassword'
      };
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(400);
    });

    it('should return 400 (empty name)', () => {
      const dto: AuthSignupDto = {
        userName: '',
        password: 'testPassword'
      };
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(400);
    });

    it('should return 400 (empty password)', () => {
      const dto: AuthSignupDto = {
        userName: 'testUser',
        password: ''
      };
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(400);
    });
  });

  describe('Sign-in', async () => {
    it('should be authorized', (done) => {
      const dto: AuthSignupDto = {
        userName: 'test',
        password: 'testPassword'
      };
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(dto)
        .expect(200)
    });

    it('should return 401 Unauthorized (Incorrect name or password)', () => {
      const dto: AuthSignupDto = {
        userName: 'fail',
        password: 'testPassword'
      };
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(dto)
        .expect(401);
    });
  })
});
