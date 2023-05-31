import { QueryResult, QueryResultRow } from 'pg';

export interface IDatabaseService {
    query<T extends QueryResultRow>(queryText: string, values?: any[]): Promise<QueryResult<T>>;
}