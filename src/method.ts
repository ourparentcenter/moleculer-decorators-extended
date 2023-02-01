export const Method = (target: any, key: string, descriptor: PropertyDescriptor) => {
  (target.methods || (target.methods = {}))[key] = descriptor.value;
};
