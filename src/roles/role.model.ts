
export interface IRole {
    id: number;
    keyword: 'admin' | 'super_admin' | 'user';
    description: string;
}