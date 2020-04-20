import { Pipe, PipeTransform } from '@angular/core';
import { Villager } from './villager.dto';

@Pipe({
  name: 'villagerFilter'
})
export class VillagerFilterPipe implements PipeTransform {

  transform(items: Villager[], filter: any): Villager[] {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => (filter.species === '*' || item.species === filter.species)
                             && (filter.gender === '*' || item.gender === filter.gender));
  }

}
