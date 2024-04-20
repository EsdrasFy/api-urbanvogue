import { defaultRoute } from '../default.controller'; // Substitua './defaultRoute' com o caminho correto para o seu controlador
import { Request, Response } from 'express';

describe('defaultRoute', () => {
  it('should respond with status 200 and "Welcome urban vogue"', async () => {
    // Mocking Request and Response objects
    const req = {} as Request;
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    } as unknown as Response;

    // Executing the controller function
    await defaultRoute(req, res);

    // Verifying the response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Welcome urban vogue');
  });
});
