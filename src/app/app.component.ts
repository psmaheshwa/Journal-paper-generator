import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import {ApiService} from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit{
  name = 'IEEE Paper Formater';

  formGroup: FormGroup;

  constructor(private fb:FormBuilder, private apiService: ApiService) {

    this.formGroup = this.fb.group({
      title: '',
      names: this.fb.array([]) ,
    });
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
    console.log(this.formGroup.value);
  }

  ngOnInit(): void {
  }

  download() {}


  submit(){
    var formData = new FormData();
    formData.append('names',this.formGroup.get('names').value);
    formData.append('title',this.formGroup.get('title').value);
    console.log(this.formGroup.value)
    this.apiService.postApiData(this.formGroup.value).subscribe(
      (res) => {
      }, (error) => {
        console.log(error);
      });
  }

}
