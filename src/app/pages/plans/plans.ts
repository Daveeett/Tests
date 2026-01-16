import { Component, OnInit } from '@angular/core';
import { Plan } from '../../interfaces/Responses/Developer/Tenants/tenants-response';
import { PlansService } from '../../core/services/Developer/plans.service';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionPersonOutline ,ionIdCardOutline} from '@ng-icons/ionicons';
@Component({
  selector: 'app-plans',
  imports: [CommonModule, NgIcon],
  viewProviders: [provideIcons({ ionPersonOutline,ionIdCardOutline})],
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
