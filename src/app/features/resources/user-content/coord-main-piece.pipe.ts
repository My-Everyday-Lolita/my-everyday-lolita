import { Pipe, PipeTransform } from '@angular/core';
import { Coordination, CoordinationFieldType } from './user-content.model';

@Pipe({
  name: 'coordMainPiece'
})
export class CoordMainPiecePipe implements PipeTransform {

  transform(coordination: Coordination): string {
    const mainPiece = coordination.fields.find(field => field.type === CoordinationFieldType.MAIN_PIECE);
    if (mainPiece && mainPiece.value) {
      return mainPiece.value;
    }
    return '';
  }

}
