import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import {Transfer,TransferObject } from '@ionic-native/transfer';
import {HttpClientModule,HttpClient} from '@angular/common/http';
import { File } from '@ionic-native/file';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  imageUrl:any;
  images:any;
  loadDone:boolean=false;
  uploading:boolean=false;
  options:any;
  imageData:any;
  constructor(public http:HttpClient ,public file:File,public navCtrl: NavController,public camera: Camera,public transfer:Transfer){}

    ionViewDidEnter() {
      this.getImages();
      this.imageUrl="data:image/jpeg;base64,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";
    }
      
    getImages()
    {
      // var options={
      //   headers:
      //   {
      //     "Authorization":"Basic "+btoa("admin:admin@123")
      //     // "content-disposition":"attachment;filename=\'hello.png\'"
      //   }
      // }
      // var url="https://swapi.co/api/films";
      var url1="http://uporg.techcraftz.com/wp-json";
      
      this.http.get(url1)
	    .subscribe(data => {
        // alert("Data=="+JSON.stringify(data));
        // console.log("Data====="+JSON.stringify(data));
	    },error=>{
        alert("error=="+JSON.stringify(error));
        console.log("Error---"+JSON.stringify(error));  
      });
    }
    uploadImage()
    {
      let options: FileUploadOptions = {
        fileKey: 'ionicfile',
        fileName: 'ionicfile',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      } 
 
    //  var options1={
    //     headers:
    //     {
    //       "Authorization":"Basic "+btoa("admin:admin@123")
    //       // "content-disposition":"attachment;filename=\'hello.png\'"
    //     }
    //   } 
     this.uploading=true;
    //  let randomString=this.getRandomString();
     let t=this.transfer.create();
        

       t.upload(this.imageUrl,'http://uporg.techcraftz.com/wp-json/wp/v2/media', options)
        .then((data) => {
          alert("dsasas==="+data);
          console.log(data)  
        }, (err) => {
         alert("error==="+JSON.stringify(err)); 
        console.log(JSON.stringify(err));  
        })
    }

    uploadImage2()
    {
        const t=this.transfer.create();
         let headers;
          headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          headers.append("content-type", "application/json");
          headers.append('Authorization', btoa('admin:admin@123'));
          headers.append("content-disposition","attachment;filename=\'hello.png\'");
          let options: FileUploadOptions={
            fileKey: 'file',
            fileName: 'name.jpg',
            mimeType: 'image/jpeg',
            headers:headers 
          }


          // {headers:{
          //   "Authorization":"Basic "+btoa("admin:admin@123"),
          //   "content-disposition":"attachment;filename=\'hello.png\'"
          // }}
          t.upload(this.imageUrl, 'http://uporg.techcraftz.com/wp-json/wp/v2/media',options)
          .then((data) => {
            console.log(data)  
            alert("Successfully upload=="+JSON.stringify(data));
            console.log("Successfully upload======="+data);
            console.log("Successfully json====="+JSON.stringify(data));
          }, (err) => {
            console.log(err);
            alert("error upload=="+JSON.stringify(err));
            console.log("error upload======="+err);
            console.log("Failed json====="+JSON.stringify(err));
          })
    }   


    uploadImage3()
    {
        const t=this.transfer.create();
        let headers;
          headers = new Headers();
          // headers.append('Content-Type', 'application/x-www-form-urlencoded');
          // headers.append("content-type", "application/json");
          // headers.append('Authorization', btoa('admin:tech123#'));
          // headers.append("content-disposition","attachment;filename=\'hello.png\'");
          let options: FileUploadOptions={
            fileKey: 'file',
            fileName: 'name.jpg',
            mimeType: 'image/jpeg',
            headers:headers 
          } 
        t.upload(this.imageUrl,'http://uporg.techcraftz.com/wp-json/wp/v2/media',
          {
            headers:
           {
            "Authorization":"Basic "+btoa("admin:admin@123"),
            "content-disposition":"attachment;filename=\'hello.png\'"
           }
          })
          .then((res) => {
            alert("Success=="+JSON.stringify(res));
          }).catch((err)=>{
            alert("Error==="+JSON.stringify(err));
          })
    }   
    downloadImage()
    {
      var url="http://sutte.techcraftz.com/wp-content/uploads/2015/09/12.jpg";
      const fileTransfer= this.transfer.create();
      fileTransfer.download(url,this.file.dataDirectory + '12.jpg').then((entry) => {
        alert("Download complete");
        console.log('download complete: ' + entry.toURL()); 
      }, (error) => {
        alert("Downloading error===");
        console.log(error)
      });
    }
    getImage()
    {
      const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType:this.camera.PictureSourceType.CAMERA ,
          allowEdit:false,
          encodingType: this.camera.EncodingType.PNG,
          correctOrientation:true,
          targetHeight:512,
          targetWidth:512
      }
      this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:

       
       this.imageData=imageData;
      // let base64Image ='data:image/png;base64,' + imageData;
      this.imageUrl='data:image/png;base64,'+imageData;
      console.log("image data=="+this.imageUrl);
      }, (err) => {
      // Handle error
      });
    }
    getRandomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    insertPost()
    {
       let data={"title":"himanshu"};

      // var headers=new headers();
      // headers.append("Authorization" : "Basic "+btoa("admin:admin@123"));
      // let headers;
      // headers=new Headers(); 
      // headers.append("content-type", "application/json") 
      // headers.append("Authorization" , "Basic "+btoa("admin:admin@123"));
      // header.append({ "content-type": "application/json"});
      // let options = new RequestOptions({ headers: headers });
      
      //  let headers;
      //  headers = new Headers();
      //  headers.append("content-type", "application/json");
      //  headers.append("Authorization" , "Basic "+btoa("admin:admin@123"));
          let headers;
          // let creds = 'username=admin'+"&password=admin@123";
          headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          headers.append("content-type", "application/json");
          headers.append('Authorization', btoa('admin:tech123#'));
          this.http.post('http://klaspring.staging.wpengine.com/wp-json/wp/v2/posts',data,{headers:headers}).subscribe(data =>{
          headers.append("content-disposition","attachment;filename=\'hello.png\'");
            let options: FileUploadOptions = 
            {
                fileKey: 'file',
                fileName: 'name.jpg',
                mimeType: 'image/jpeg',
            }
            const t= this.transfer.create();
            t.upload(this.imageUrl, 'http://klaspring.staging.wpengine.com/wp-json/wp/v2/media', options)
              .then((data) => {
                console.log(data)  
                alert("Successfully upload=="+JSON.stringify(data));
                console.log("Successfully upload======="+data);
                console.log("Successfully json====="+JSON.stringify(data));
              }, (err) => {
                console.log(err);
                alert("Successfully upload=="+JSON.stringify(data));
                console.log("Failed upload======="+err);
                console.log("Failed json====="+JSON.stringify(err));
              })
            }, error => {
                alert("Failed to post in wordpress table=="+error);
                console.log("Failed======="+error);
                console.log("Failed json====="+JSON.stringify(error));
            });
    }
}
