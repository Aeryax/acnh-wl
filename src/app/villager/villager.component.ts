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

  public model: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const base64: string = params.get('b');
      this.test = [];
      try {
        const arrUrl = JSON.parse(atob(decodeURIComponent(base64)));
        arrUrl.forEach(val => {
          console.log(val.i)
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
    if (this.test.indexOf(e.item) === -1 && this.test.length < 10) {
      this.test.push(e.item);
      this.generateUrl();
    }

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
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  delete(villager: Villager) {
    const index = this.test.findIndex(elem => {
      return elem.id === villager.id;
    });
    if (index !== -1) {
      this.test.splice(index, 1);
    }
    this.generateUrl();
  }

}
