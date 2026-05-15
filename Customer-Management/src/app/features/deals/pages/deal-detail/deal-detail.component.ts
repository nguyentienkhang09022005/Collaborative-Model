import { Component } from '@angular/core';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealItem } from '../../../../core/models/deal.model';
import { DealService } from '../../../../core/services/deal.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deal-detail',
  imports: [CommonModule, FormsModule, CustomDatePipe],
  templateUrl: './deal-detail.html',
  styleUrls: ['./deal-detail.css'],
})
export class DealDetailComponent {
  dealForm: DealItem = {} as DealItem;
  dealData: DealItem[] = [];
  isLoading: boolean = false;
  isEditing: boolean = false;
  isSaveEdit: boolean = true;
  idDeal: string = "";

  constructor(private deadService: DealService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.route.queryParams.subscribe(param => {
      this.idDeal = param['id']
      if (this.idDeal){
        this.onInfDeal(this.idDeal)
      }
    })
  }

  onInfDeal(idDeal: string){
    this.deadService.GetInfDeal(idDeal).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }

        this.dealData = res.data?.dealById ?? [];

        const item = this.dealData[0];
        if (!item) return;

        this.dealForm = item;

        console.log(res);
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  onUpdateDeal(status: string){
    this.deadService.UpdateDeal(status, this.idDeal).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.dealData = res.data?.updateDeal ?? [];
        console.log(res);
        this.onInfDeal(this.dealForm.idDeal);
        alert("Cập nhật thông tin thành công!");

        this.isEditing = false;
        this.isSaveEdit = true;
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  onEdit() {
    this.isEditing = true;
    this.isSaveEdit = false;
  }
}
