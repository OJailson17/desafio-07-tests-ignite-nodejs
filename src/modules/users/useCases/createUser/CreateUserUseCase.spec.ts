import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";

let usersRepository: InMemoryUsersRepository;

describe("Create a new user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
  });

  it("should be able to create a new user", async () => {
    const user = await usersRepository.create({
      name: "Test name",
      email: "test@test.com",
      password: "test123",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with the same email", async () => {
    try {
      await usersRepository.create({
        name: "Test name",
        email: "test@test.com",
        password: "test123",
      });

      await usersRepository.create({
        name: "Test name",
        email: "test@test.com",
        password: "test123",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CreateUserError);
    }
  });
});
