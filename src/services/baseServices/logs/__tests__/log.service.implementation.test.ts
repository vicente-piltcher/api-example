import { LogServiceImplementation } from '../log.service.implementation';
import { LogRepositoryImplementation } from '../../../../repositories/baseRepositories/log/log.repository.implementation.winston';

jest.mock('../../../../repositories/baseRepositories/log/log.repository.implementation.winston');

describe('LogServiceImplementation', () => {
  let logService: LogServiceImplementation;
  let logRepositoryMock: jest.Mocked<LogRepositoryImplementation>;

  beforeEach(() => {
    logRepositoryMock = {
      createLog: jest.fn((tag, message) => {
        console.log(`logRepositoryMock.createLog called with tag: ${tag}, message: ${message}`);
      }),
    } as unknown as jest.Mocked<LogRepositoryImplementation>;

    logService = LogServiceImplementation.build(logRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the same instance (singleton pattern)', () => {
    const instance1 = LogServiceImplementation.build(logRepositoryMock);
    const instance2 = LogServiceImplementation.build(logRepositoryMock);
    expect(instance1).toBe(instance2);
  });

  /*
  it('should create a log message correctly', async () => {
    const tag = 'TESTE-CREATE-LOG';
    const idNumber = '67069363087';
    const operation = 'RETORNO';
    const message = 'Tudo funcionou ok';

    await logService.createLog(tag, idNumber, operation, message);

    const expectedLogMessage = `[TESTE-CREATE-LOG] [ID] => 67069363087 => [RETORNO] "Tudo funcionou ok"\n`;
    expect(logRepositoryMock.createLog).toHaveBeenCalledWith('info', expectedLogMessage);
  });
/*
  it('should create a log message without idNumber', async () => {
    const tag = 'INFO';
    const idNumber = null;
    const operation = 'CREATE';
    const message = 'This is a test log message';

    await logService.createLog(tag, idNumber, operation, message);

    const expectedLogMessage = `[INFO] [CREATE] "This is a test log message"\n`;
    expect(logRepositoryMock.createLog).toHaveBeenCalledWith('info', expectedLogMessage);
  });

  it('should create a log message without message', async () => {
    const tag = 'INFO';
    const idNumber = '12345';
    const operation = 'CREATE';
    const message = undefined;

    await logService.createLog(tag, idNumber, operation, message);

    const expectedLogMessage = `[INFO] [ID] => 12345 => [CREATE]\n`;
    expect(logRepositoryMock.createLog).toHaveBeenCalledWith('info', expectedLogMessage);
  });
*/
});
