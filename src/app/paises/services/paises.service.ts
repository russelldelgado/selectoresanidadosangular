import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  private _baseUrl: string = "https://restcountries.com/v2";

  //indicamos que esto regresa un arreglo de string, hacemos la desestructuración para evitar posibles problemas de referencia.
  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private httpClient: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=alpha3Code,name`;
    return this.httpClient.get<PaisSmall[]>(url)
  }

  getPaisPorCodigo(codigo: string): Observable<Pais | null> {

    if (!codigo) {
      return of(null);
    }

    const url = `https://restcountries.com/v2/alpha/${codigo}`

    return this.httpClient.get<Pais>(url);


  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    const url = `https://restcountries.com/v2/alpha/${codigo}?fields=alpha3Code,name`
    return this.httpClient.get<PaisSmall>(url);
  }


  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {

    //lo primero que tengo que hacer es comporbar que existen este arreglo

    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = []

    //barremos todas los borders que tengamos para llenar las peticiones
    //con esto obtengo mis peticiones llenas de observables
    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo!);
     peticiones.push(peticion);

    });
//con esto puedo disparar todas las peticiones de forma simultanea con un operador de rxjs

    return combineLatest(peticiones);

  }

}
