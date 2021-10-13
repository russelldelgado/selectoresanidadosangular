import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';
import { switchMap, tap} from 'rxjs/operators'

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  regiones : string[] = [];
  paises : PaisSmall[] = []
  // fronteras : string[] | undefined = undefined;
  fronteras : PaisSmall[] | undefined = undefined;

  // UI

  cargando : boolean = false;



  miFormulario  = this.fb.group({
    region   : ['' , Validators.required],
    pais     : ['' , Validators.required],
    frontera : ['' , Validators.required],


  });

  constructor(private fb : FormBuilder , private paisesService : PaisesService){}

  ngOnInit(): void {
    this.regiones= this.paisesService.regiones;



    //cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges.subscribe(region =>{
    //   this.paises = [];
    //   console.log(region);
    //   this.paisesService.getPaisesPorRegion(region).subscribe(paises => {

    //    this.paises = paises;
    //   })
    // })
    
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( (_) => {
        this.paises = [];
        this.miFormulario.get('pais')?.reset('');
        this.fronteras = undefined;
        this.cargando = true;
      }),
      switchMap(region => this.paisesService.getPaisesPorRegion(region)),
    )
    .subscribe(paises => {
      this.paises = paises;
      this.cargando = false;
    });

    //cuando cambiamos el pais tenemos que ver los resultados que aparecen.

    this.miFormulario.get('pais')?.valueChanges.pipe(
      tap(pais => {
        this.miFormulario.get('frontera')?.reset('');
        this.fronteras = undefined;
        this.cargando = true;

      }),
      switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
      switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!)),
    ).subscribe(paises => {
     // this.fronteras = datos?.borders
     console.log(paises)
     this.fronteras = paises;
     if(this.fronteras?.length == 0){
      this.fronteras = undefined;

     }
      this.cargando = false;
    });
    
    
  }


  guardar(){
    console.log('guardando');
    
  }

}
