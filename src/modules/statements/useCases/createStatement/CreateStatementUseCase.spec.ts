import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create statement", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to make a new deposit", async () => {
    const user = await usersRepository.create({
      name: "Test name",
      email: "test@test.com",
      password: "test123",
    });

    const statementData = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit description",
    };

    const statement = await createStatementUseCase.execute(statementData);

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to make a new deposit", async () => {
    expect(async () => {
      await usersRepository.create({
        name: "Test name",
        email: "test@test.com",
        password: "test123",
      });

      const statementData = {
        user_id: "u00u301u02u31283012",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "deposit description",
      };

      await createStatementUseCase.execute(statementData);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be able to make a new withdraw", async () => {
    const user = await usersRepository.create({
      name: "Test name",
      email: "test@test.com",
      password: "test123",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 300,
      description: "deposit description",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 200,
      description: "withdraw description",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to make a withdraw with insufficient funds", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "Test name",
        email: "test@test.com",
        password: "test123",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 300,
        description: "deposit description",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 500,
        description: "withdraw description",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
