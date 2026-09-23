export class Categoria {
  id!: string;
  nombre!: string;
  orden: number = 0;
  activo: boolean = true;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial?: Partial<Categoria>) {
    if (partial) Object.assign(this, partial);
  }
}
