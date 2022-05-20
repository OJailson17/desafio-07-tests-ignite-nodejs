import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to show user profile", async () => {
    const userData = {
      name: "Test name",
      email: "test@test.com",
      password: "test123",
    };

    const user = await usersRepository.create(userData);

    const userInfo = await showUserProfileUseCase.execute(user.id);

    expect(userInfo).toHaveProperty("id");
  });

  it("should not be able to show user profile with wrong user id", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute(
        "db7539c2-4b5f-4de4-a8aa-838404303524"
      );
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
