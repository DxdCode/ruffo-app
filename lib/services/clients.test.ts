import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getClients, getClientById, createClientRecord } from './clients'

describe('Clients Service', () => {
    let mockSupabase: any;

    beforeEach(() => {
        vi.clearAllMocks()

        const mockQueryBuilder = {
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            ilike: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            then: vi.fn()
        };

        mockSupabase = {
            from: vi.fn().mockReturnValue(mockQueryBuilder)
        };
    })

    describe('getClients', () => {
        it('Deberia obtener los clientes con las opciones por defecto', async () => {
            const mockData = [{ id: '1', full_name: 'John Doe' }];
            mockSupabase.from('clients').order.mockResolvedValue({ data: mockData, error: null });

            const result = await getClients(mockSupabase);

            expect(mockSupabase.from).toHaveBeenCalledWith('clients');
            expect(mockSupabase.from('clients').select).toHaveBeenCalledWith('id, full_name, email, phone, created_at, pets(count)');
            expect(mockSupabase.from('clients').order).toHaveBeenCalledWith('created_at', { ascending: false });
            expect(result.data).toEqual(mockData);
            expect(result.error).toBeNull();
        })

        it('Deberia aplicar el filtro de busqueda por nombre usando ilike', async () => {
            mockSupabase.from('clients').ilike.mockResolvedValue({ data: [], error: null });

            await getClients(mockSupabase, { query: 'John' });

            expect(mockSupabase.from('clients').ilike).toHaveBeenCalledWith('full_name', '%John%');
        })

        it('Deberia aplicar el filtro de busqueda por telefono usando ilike', async () => {
            mockSupabase.from('clients').ilike.mockResolvedValue({ data: [], error: null });

            await getClients(mockSupabase, { query: '1234', filterBy: 'phone' });

            expect(mockSupabase.from('clients').ilike).toHaveBeenCalledWith('phone', '%1234%');
        })
    })

    describe('getClientById', () => {
        it('Deberia obtener un cliente por ID', async () => {
            const mockClient = { id: 'uuid-1', full_name: 'Test Client' };
            mockSupabase.from('clients').single.mockResolvedValue({ data: mockClient, error: null });

            const result = await getClientById(mockSupabase, 'uuid-1');

            expect(mockSupabase.from('clients').select).toHaveBeenCalledWith('*');
            expect(mockSupabase.from('clients').eq).toHaveBeenCalledWith('id', 'uuid-1');
            expect(result.data).toEqual(mockClient);
        })
    })

    describe('createClientRecord', () => {
        it('Deberia pasar el payload del formulario del cliente correctamente y convertir el email vacio a null', async () => {
            const mockInput = {
                full_name: 'Nuevo Usuario',
                phone: '555-5555',
                email: '   '
            };

            mockSupabase.from('clients').single.mockResolvedValue({ data: { id: 'new-uuid' }, error: null });

            await createClientRecord(mockSupabase, mockInput);

            expect(mockSupabase.from('clients').insert).toHaveBeenCalledWith({
                full_name: 'Nuevo Usuario',
                phone: '555-5555',
                email: null
            });
        })
    })
})
