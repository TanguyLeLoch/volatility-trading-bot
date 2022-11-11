type Ports = {
  [key: string]: number;
};

export const ports: Ports = {
  balance: 43001,
  brain: 43002,
  network: 43003,
  order: 43004,
  plan: 43005,
  async: 43006,
  discord: 43007,
  customer: 43008,
};

let moduleName = '';
export const setModuleName = (name: string) => {
  moduleName = name;
};
export const getModuleName = () => {
  return moduleName;
};
