import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to get the balance", async () => {
    const user = await usersRepository.create({
      name: "Test name",
      email: "test@test.com",
      password: "test123",
    });

    await statementsRepository.create({
      user_id: user.id,
      amount: 300,
      type: OperationType.DEPOSIT,
      description: "deposit description",
    });

    await statementsRepository.create({
      user_id: user.id,
      amount: 100,
      type: OperationType.WITHDRAW,
      description: "withdraw description",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id,
    });

    expect(balance.balance).toBe(200);
  });

  it("should not be able to get the balance if user id does not exist", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "8u9mscpas",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
