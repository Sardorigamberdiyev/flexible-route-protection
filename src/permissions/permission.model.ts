
export interface IPermission {
    id: number;
    keyword: 'read' | 'update' | 'delete' | 'create';
    description: string;
}