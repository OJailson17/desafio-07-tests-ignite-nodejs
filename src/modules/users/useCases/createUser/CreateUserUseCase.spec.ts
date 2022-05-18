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
});
