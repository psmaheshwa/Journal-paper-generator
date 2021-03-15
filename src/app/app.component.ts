import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import {ApiService} from './service/api.service';
import {saveAs} from 'file-saver';
import {pdfBase64} from './pdfBase64';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit{
  name = 'IEEE Paper Formater';
  base64=pdfBase64;
  formGroup: FormGroup;

  constructor(private fb:FormBuilder, private apiService: ApiService) {

    this.formGroup = this.fb.group({
      title: '',
      names: this.fb.array([]) ,
      department:'',
      college:'',
      location:'',
      abstract:'',
      indexTerms:'',
      sections: this.fb.array([])
    });
  }

  sections() : FormArray {
    return this.formGroup.get("sections") as FormArray
  }

  newSection(): FormGroup {
    return this.fb.group({
      sectionTitle: '',
      sectionContent: ''
    })
  }

  addSections() {
    this.sections().push(this.newSection());
  }


  removeSection(i:number) {
    this.sections().removeAt(i);
  }

  names() : FormArray {
    return this.formGroup.get("names") as FormArray
  }

  newName(): FormGroup {
    return this.fb.group({
      firstname: '',
      lastname: '',
    })
  }

  addName() {
    this.names().push(this.newName());
  }

  removeName(i:number) {
    this.names().removeAt(i);
  }

  onSubmit() {
  }

  ngOnInit(): void {
  }

  download() {
    console.log('lsdbhd');
    this.apiService.getApiData().subscribe(
      data => {
        saveAs(data, 'output.pdf');
        this.formGroup = this.fb.group({
          title: '',
          names: this.fb.array([]) ,
          department:'',
          college:'',
          location:'',
          abstract:'',
          indexTerms:'',
          sections: this.fb.array([])
        });
      },
      error => console.error(error));
  }



  submit(){
    this.apiService.postApiData(this.formGroup.value).subscribe(
      (data) => {
        console.log(data);
          this.base64 = data;
        console.log("Submitted")
      }, (error) => {
        console.log(error);
      });
  }

}
