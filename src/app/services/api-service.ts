import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // URL base centralizada (ajusta según environment si corresponde)
  public readonly baseUrl = 'http://localhost:5040';

/*   constructor(public http: HttpClient) {}
 */
/*   public url(path: string) {
    return `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }
*/

} 