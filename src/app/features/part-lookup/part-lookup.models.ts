/** A part record for the simple dialog flat table. */
export interface SimplePartRecord {
  partId: string;
  partDescription: string;
  keyword: string;
  crossReference: string;
  cost: number;
}

/** An extended part record for the advanced lookup table. */
export interface ExtendedPartRecord extends SimplePartRecord {
  categoryId: string;
  categoryDescription: string;
  stockLocationId: string;
  equipmentTypeId: string;
  taskTypeId: string;
  classTypeId: string;
  onHand: number;
  onOrder: number;
  committed: number;
  requestOutPending: number;
  manufacturerPartNumber: string;
  manufacturer: string;
  imageUrl: string;
}
