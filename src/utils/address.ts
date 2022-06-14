export const formatAddress = (address: string): string => {
    const start = address.slice(0, 10);
    const end = address.slice(address.length - 10);

    return `${start}....${end}`;
};
