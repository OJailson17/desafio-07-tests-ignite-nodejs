import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: "Test name",
      email: "test@test.com",
      password: "test123",
    };

    const response = await createUserUseCase.execute(user);

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a new user with the same email", async () => {
    expect(async () => {
      const user = {
        name: "Test name",
        email: "test@test.com",
        password: "test123",
      };

      const user1 = {
        name: "Test name 1",
        email: "test@test.com",
        password: "test123",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user1);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
