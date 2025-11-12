import { Component } from '@angular/core';
import { Ping } from '../../services/ping';
@Component({
  selector: 'app-tests',
  imports: [],
  templateUrl: './tests.html',
  styleUrl: './tests.css',
})
export class Tests {
  
  
  constructor(private testService:Ping){}

  public Ping (){
    this.testService.ping()
      .subscribe({
        next: (response) => {
          console.log(response.data)
          if (!response.result) {
            console.error('Not pong:(', response.message);
          }
        },
        error: (error) => {
          console.error('Error', error);
        }
      });
  }
  
}
