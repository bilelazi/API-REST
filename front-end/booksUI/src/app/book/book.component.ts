import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

export class Book {
  constructor(
    public id: number,
    public bookname: string,
    public descr: string,
    public auth: string,
    public category: string

  ) {
  }
}


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  books:Book[];
  closeResult:string;
  editForm:FormGroup;
  private deleteId: number;

  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(
    private httpClient:HttpClient,
    private modalService: NgbModal,
    private fb:FormBuilder            
  ) { }

  ngOnInit(): void {
    this.getBooks();
  this.editForm = this.fb.group({
    id: [''],
    bookname: [''],
    descr: [''],
    auth: [''],
    category: ['']
  } );
  }

  getBooks(){
    this.httpClient.get<any>('https://localhost:8000/api/book').subscribe(
      response => {
        console.log(response);
        this.books = response;
      }
    );
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:8000/api/book/new';
    this.httpClient.post(url, f.value,this.httpOptions)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }


  openDetails(targetModal, book: Book) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
   });
    document.getElementById('bname').setAttribute('value', book.bookname);
    document.getElementById('des').setAttribute('value', book.descr);
    document.getElementById('aut').setAttribute('value', book.auth);
    document.getElementById('cat').setAttribute('value', book.category);

 }

 openEdit(targetModal, book: Book) {
  this.modalService.open(targetModal, {
   centered: true,
   backdrop: 'static',
   size: 'lg'
 });
 this.editForm.patchValue( {
  id: book.id, 
  bookname: book.bookname,
  descr: book.descr,
  auth: book.auth,
  category: book.category
});
}



onSave() {
  const editURL = 'http://localhost:8000/apip/books/' + this.editForm.value.id ;
  this.httpClient.put(editURL, this.editForm.value,this.httpOptions)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    });
}

openDelete(targetModal, book: Book) {
  this.deleteId = book.id;
  this.modalService.open(targetModal, {
    backdrop: 'static',
    size: 'lg'
  });
}

onDelete() {
  const deleteURL = 'http://localhost:8000/apip/books/' + this.deleteId ;
  this.httpClient.delete(deleteURL)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    });
}

}
