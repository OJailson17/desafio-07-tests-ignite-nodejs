import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to get the statement operation", async () => {
    const user = await usersRepository.create({
      name: "Test name",
      email: "test@test.com",
      password: "test123",
    });

    const createdStatement = await statementsRepository.create({
      user_id: user.id,
      amount: 300,
      type: OperationType.DEPOSIT,
      description: "deposit description",
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: createdStatement.id,
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to get the statement operation if user does not exist", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "Test name",
        email: "test@test.com",
        password: "test123",
      });

      await getStatementOperationUseCase.execute({
        user_id: "jcoiasicoinasoca90",
        statement_id: "1234",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get the statement if operation does not exist", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "Test name",
        email: "test@test.com",
        password: "test123",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "1234",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
