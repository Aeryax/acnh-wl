import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import villagers from '../data/villagers.json';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Villager } from './villager.dto';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-villager',
  templateUrl: './villager.component.html',
  styleUrls: ['./villager.component.scss']
})
export class VillagerComponent implements OnInit {

  test: Villager[];
  url: string;
  vill: Villager[];
  showCriteria = false;
  speciesCriteria: string;
  genderCriteria: string;

  public model: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    ) {
      this.vill = villagers;
    }

  ngOnInit(): void {
    this.genderCriteria = '*';
    this.speciesCriteria = '*';
    this.activatedRoute.paramMap.subscribe(params => {
      const base64: string = params.get('b');
      this.test = [];
      try {
        // A refactor dans un service
        const arrUrl = JSON.parse(atob(decodeURIComponent(base64)));
        arrUrl.forEach(val => {
          const objUrl: Villager = villagers.find(elem => {
            return elem.id === val.i;
          });
          if (objUrl) {
            objUrl.owned = val.o;
            this.test.push(objUrl);
          }
        });
      } catch (e) {
      }
      this.generateUrl();
    });
  }

  search(text$: Observable<string>) {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : villagers.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  }

  formatter(x: Villager) {
    return x.name;
  }

  onSelect(e: NgbTypeaheadSelectItemEvent) {
    e.preventDefault();
    this.add(e.item);

    this.model = '';
  }

  generateUrl() {
    const arrUrl = [];
    this.test.forEach(val => {
      arrUrl.push({ i: val.id, o: val.owned });
    });
    const param = encodeURIComponent(btoa(JSON.stringify(arrUrl)));
    this.url = environment.frontUrl + 'villagers-wl/' + param;
    this.location.go('villagers-wl/' + param);

  }

  copyText(inputElement) {
    // TODO : Ajouter une notification pour indiquer la réussite
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  add(villager: Villager): void {
    // 10 = nombre d'habitants, à mettre en constante
    if (this.test.indexOf(villager) === -1 && this.test.length < 10) {
      this.test.push(villager);
      this.generateUrl();
    }
  }

  delete(villager: Villager): void {
    const index = this.test.findIndex(elem => {
      return elem.id === villager.id;
    });
    if (index !== -1) {
      this.test.splice(index, 1);
    }
    this.generateUrl();
  }

  showHideCriteria(): void {
    this.showCriteria = !this.showCriteria;
  }

  getListGender(): any[] {
    // a refactor, il ne faut pas construire la liste plusieurs fois
    const listGender = [{ value: '*', name: 'Non renseigné'}];
    villagers.forEach(elem => {
      const f = listGender.find(elem2 => {
        return elem2.value === elem.gender;
      });
      if (f === undefined) {
        listGender.push({ value: elem.gender, name: elem.gender});
      }
    });

    listGender.sort((a: any, b: any) => {
      return a.value.localeCompare(b.value);
    });

    return listGender;
  }

  getListSpecies(): any[] {
    // a refactor, il ne faut pas construire la liste plusieurs fois
    const listSpecies = [{ value: '*', name: 'Non renseigné'}];
    villagers.forEach(elem => {
      const f = listSpecies.find(elem2 => {
        return elem2.value === elem.species;
      });
      if (f === undefined) {
        listSpecies.push({ value: elem.species, name: elem.species});
      }
    });

    listSpecies.sort((a: any, b: any) => {
      return a.value.localeCompare(b.value);
    });

    return listSpecies;
  }

}
