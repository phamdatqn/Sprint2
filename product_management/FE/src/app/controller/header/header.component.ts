import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../../service/token-storage.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {ProductService} from '../../service/product.service';
import {HttpEvent} from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string;
  roles: string[] = [];
  isCustomer = false;
  isAdmin = false;
  isEmployee = false;
  sumQuantityCart: HttpEvent<number> ;
  constructor(private tokenService: TokenStorageService,
              private productService: ProductService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.username = '';
    this.showUsername();
    this.getSumQuantity();
  }

  showUsername() {
    this.username = this.tokenService.getUser().username;
    this.roles = this.tokenService.getUser().roles;
    this.isCustomer = this.roles.indexOf('ROLE_CUSTOMER') !== -1;
    this.isEmployee = this.roles.indexOf('ROLE_EMPLOYEE') !== -1;
    this.isAdmin = this.roles.indexOf('ROLE_ADMIN') !== -1;
  }

  getSumQuantity() {
    this.productService.sumQuantityCart(this.username).subscribe(value => {
      this.sumQuantityCart = value;
    });
  }


  whenLogout() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: ' Đăng xuất thành công !',
      showConfirmButton: false,
      timer: 1000
    }).then(r => {
      this.tokenService.logOut();
      this.username = '';
      this.isCustomer = false;
      this.isEmployee = false;
      this.isAdmin = false;
      window.location.replace('product');
    });

  }

  reload() {
    window.location.reload();
  }
}
