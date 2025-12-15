import { Component, OnInit } from '@angular/core';
import { Plan } from '../../interfaces/Responses/Developer/Tenants/tenants-response';
import { PlansService } from '../../core/services/Developer/plans.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-plans',
  imports: [CommonModule],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans implements OnInit {
  plans: Plan[] = [];
  
  constructor(private plansService: PlansService){}
  ngOnInit(): void {
    this.plansService.getAllPlans().subscribe((resp: any) => {
      this.plans = resp.data || [];
    });
  }

}
