import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../core/services/staff.service';
import { Router } from '@angular/router';
import { StaffItem } from '../../../core/models/staff.model';

@Component({
  selector: 'app-staff-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.css',
})
export class StaffListComponent {

  staffs: StaffItem[] = [];
  isLoading: boolean = false;
  
  constructor(private staffService: StaffService, 
              private router: Router){}

  ngOnInit(){
    this.onListStaff();
  }

  onListStaff(){
    this.staffService.GetListStaff().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.staffs = res.data?.staffs ?? [];

        console.log(res);
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }
}
