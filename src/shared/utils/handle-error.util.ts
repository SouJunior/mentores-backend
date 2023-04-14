import { UnprocessableEntityException } from '@nestjs/common';

export const handleError = (error: Error): undefined => {
  const errorLines = error.message?.split('\n');
  const lastErrorLine = errorLines[errorLines.length - 1]?.trim();

  throw new UnprocessableEntityException(
    lastErrorLine || 'An error occurred while performing the operation.',
  );
};
