export const get = (obj: Record<string, any>, path: string, def?: any): any => {
  const fullPath = path
    .replace(/\[/g, '.')
    .replace(/]/g, '')
    .split('.')
    .filter(Boolean);

  if (obj === null || obj === undefined) {
    return null;
  }

  return fullPath.every(function (step: string) {
    if (obj[step] !== null) {
      const resultEveryFunc = !(step && (obj = obj[step]) === undefined);
      return resultEveryFunc;
    }
    return null;
  })
    ? obj
    : def;
};

export const unbase64 = (str: string): string =>
  Buffer.from(str, 'base64').toString('utf8');

type GlobalId = {
  type: string;
  id: string;
};

export const isEmail = (string: string): boolean => {
  const isEmailRegExp = new RegExp(
    // eslint-disable-next-line security/detect-unsafe-regex,no-control-regex
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  );

  return isEmailRegExp.test(string);
};

export const fromGlobalId = (globalId: string): GlobalId => {
  const unbasedGlobalId = unbase64(globalId);
  const delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1),
  };
};

export default {
  fromGlobalId,
  isEmail,
};
