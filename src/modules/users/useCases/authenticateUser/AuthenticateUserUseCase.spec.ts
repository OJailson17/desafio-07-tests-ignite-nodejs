import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to authenticate the user", async () => {
    const user: ICreateUserDTO = {
      name: "Test name auth",
      email: "test123@test.com",
      password: "test1234",
    };

    await createUserUseCase.execute(user);

    const authUser = {
      email: user.email,
      password: user.password,
    };

    const session = await authenticateUserUseCase.execute(authUser);

    expect(session).toHaveProperty("token");
  });

  it("should not be able to authenticate the user with wrong email address", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Test name auth",
        email: "test123@t.com",
        password: "test1234",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "test12@test.com",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate the user with wrong password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Test name auth",
        email: "test123@test.com",
        password: "test1234",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "8782918",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
