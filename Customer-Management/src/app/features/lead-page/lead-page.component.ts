import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LeadService } from '../../core/services/lead.service';
import { LeadItem } from '../../core/models/lead.models';

@Component({
  selector: 'app-lead-page',
  imports: [CommonModule],
  templateUrl: './lead-page.html',
  styleUrls: ['./lead-page.css'],
})
export class LeadPageComponent {
  
  leads: LeadItem[] = []
  isLoading: boolean = false;

  openMenu: any = null;
  
  toggleMenu(item: any) {
    this.openMenu = this.openMenu === item ? null : item;
  }

  constructor(private leadService: LeadService){}

  ngOnInit(){
    this.onListLead();
  }

  onListLead(){
    this.leadService.GetListLead().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.leads = res.data?.leads ?? [];
        console.log(res);
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }
}
