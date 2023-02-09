/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const Method = (target: any, key: string, descriptor: PropertyDescriptor) => {
  (target.methods || (target.methods = {}))[key] = descriptor.value;
};
