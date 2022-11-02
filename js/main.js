enchant();

var Chat_Data = {};
var Image_Data = {};
var Sound_Data = {};
var Choice_Data = {};
var Key_settings = {
  決定キー:"c",加速キー:"z",停止キー:"x",メニューキー:"s",
  上キー:"↑",下キー:"↓",左キー:"←",右キー:"→"
};
var Flag_name = null;
var Flag_item_name = null;
var Stage = {名前:"最初",x:0,y:0};
var Key_config = {
  決定:{キー:Key_settings.決定キー,プッシュ:false,タイム:0},
  加速:{キー:Key_settings.加速キー,プッシュ:false,タイム:0},
  停止:{キー:Key_settings.停止キー,プッシュ:false,タイム:0},
  メニュー:{キー:Key_settings.メニューキー,プッシュ:false,タイム:0},
  上:{キー:Key_settings.上キー,プッシュ:false,タイム:0},
  下:{キー:Key_settings.下キー,プッシュ:false,タイム:0},
  左:{キー:Key_settings.左キー,プッシュ:false,タイム:0},
  右:{キー:Key_settings.右キー,プッシュ:false,タイム:0}
};

var SE1 = document.createElement("audio");
var SE2 = document.createElement("audio");
var BGM = document.createElement("audio");

BGM.addEventListener("ended",function(e){
  BGM.currentTime = BGM.id;
  BGM.play();
});

function Game_load(width,height){

  var game = new Game(width,height);
  game.fps = 20;
  game.onload = function(){

    var Chat_Scene = function(Datas){

      var scene = new Scene();

      var Image_count = null;
      var Image = [];
      var Images_Data = {};

      function Images(Width,Height,X,Y,Src){
        Image_count = Image.length;
        Image[Image_count] = new Sprite();
        Image[Image_count]._element = document.createElement("img");
        Image[Image_count]._element.src = Src;
        Image[Image_count].width = Width;
        Image[Image_count].height = Height;
        Image[Image_count].x = X;
        Image[Image_count].y = Y;
        scene.addChild(Image[Image_count]);
        return;
      };

      for(var I = 0; I < 10; I++) Images(width,height,0,0,"image/透明.png");

      Images(width,400,0,480,"image/textbox.png");
      Image[10].opacity = 0.5;

      var Numbers = 420;
      var Row = 6;
      var One_column = 20;

      function Texts(){
        if(I%One_column==0) Numbers += 62;
        Text[I] = new Sprite();
        Text[I]._element = document.createElement("innerHTML");
        Text[I]._style.font  = "60px ゴシック";
        Text[I]._style.color = "white";
        Text[I].x = 62 * (I%One_column) + 180;
        Text[I].y = Numbers;
        scene.addChild(Text[I]);
      };

      for(var I = 0; I < Row * One_column; I++) Texts();

      var ChoiceText = [];
      var Choice_Number = null;

      function Choice(){
        ChoiceText[I] = new Sprite();
        ChoiceText[I]._element = document.createElement("innerHTML");
        ChoiceText[I]._style.font  = "60px ゴシック";
        ChoiceText[I]._style.color = "white";
        ChoiceText[I].x = 1000;
        ChoiceText[I].y = 380 - I * 90;
        Images(600,80,ChoiceText[I].x-20,ChoiceText[I].y,"image/textbox.png");
        Image[I+11].opacity = 0;
        scene.addChild(ChoiceText[I]);
      };

      for(var I = 0; I < 5; I++) Choice();

      Datas = Chat_Data[Datas];
      var Text_Number = 0;
      var Name = 20;
      var To_Next = false;
      var Next_Scene = null;
      var Opacity = -0.1;
      var Time_spent = 0;
      var Spent = 0;
      Chat_Reset();

      function Chat_Reset(){
        if(Datas.時間) Time_spent = Datas.時間;
        else Time_spent = 0;
        Spent = 0;
        for(var I = 0; I < 5; I++){
          Image[I+11].opacity = 0;
          ChoiceText[I]._element.textContent = "";
        };
        if(Datas.選択肢) Choice_Number = Choice_Data[Datas.選択肢].length - 1;
        Name = 20;
        Text_Number = 0;
        To_Next = false;
        if(Sound_Data[Datas.音]) SE1.src = Sound_Data[Datas.音];
        for(var I = 0; I < Row * One_column; I++){
          Text[I]._element.textContent = "";
          Text[I].opacity = 1;
        };
        if(Datas.名前){
          for(var J = 0; J < Datas.名前.length; J++) Text[J]._element.textContent = Datas.名前[J];
          Text[J]._element.textContent = ":";
        };
        for(var I = 0; I < 10; I++){
          Image[I].opacity = 0;
          Image[I]._element.src = "image/透明.png";
          if(!Datas.画像) continue;
          if(!Datas.画像[I]) continue;
          Temp = Datas.画像[I].match(/(.+)fade(In|Out)(\d+)/);
          if(Temp){
            switch(Temp[2]){
              case "In":
                Temp1 = Temp[3];
                Temp2 = null;
                break;
              case "Out":
                Temp1 = null;
                Temp2 = Temp[3];
                break;
            };
            Temp = Image_Data[Temp[1]];
          }
          else{
            Temp1 = null;
            Temp2 = null;
            Temp = Image_Data[Datas.画像[I]];
          };
          if(Temp.x) Image[I].x = Temp.x;
          if(Temp.y) Image[I].y = Temp.y;
          if(Temp.width) Image[I].width = Temp.width;
          if(Temp.height) Image[I].height = Temp.height;
          if(Temp1) Image[I].tl.fadeIn(Temp1);
          else Image[I].opacity = 1;
          if(Temp2) Image[I].tl.fadeOut(Temp2);
          if(Temp.src) Image[I]._element.src = Temp.src;
        };
        return;
      };

      scene.addEventListener("enterframe",function(){

        for(var L = 0; L < Object.keys(Key_config).length; L++){
          if(Key_config[Object.keys(Key_config)[L]].タイム){
            Key_config[Object.keys(Key_config)[L]].タイム--;
          };
        };

        if(Time_spent-Spent){
          Spent++;
          return;
        };
        Spent = 0;

        if(Text_Number==Datas.テキスト.length) To_Next = true;

        if(!To_Next){
          if(Datas.テキスト[Text_Number]=="§"){
            Name += 19 - (Text_Number%20);
            Text_Number++;
          };
          if(Datas.音){
            if(SE1.paused) SE1.play();
            else SE1.currentTime = 0;
          };
          Text[Text_Number+Name]._element.textContent = Datas.テキスト[Text_Number];
          Text_Number++;
        }
        else{
          if(Datas.次){
            Next_Scene = Datas.次;
            Text[Text_Number+Name]._element.textContent = "▼";
            Text[Text_Number+Name].opacity += Opacity;
            if(Text[Text_Number+Name].opacity < 0)Opacity = 0.1;
            if(Text[Text_Number+Name].opacity > 1) Opacity = -0.1;
          }
          else{

            if(game.input.up&&!game.input.down&&!game.input.left&&!game.input.right&&!Key_config.上.タイム){
              Key_config.上.タイム = 5;
              Choice_Number++;
              if(Choice_Number==Choice_Data[Datas.選択肢].length) Choice_Number = 0;
            };
            if(!game.input.up&&game.input.down&&!game.input.left&&!game.input.right&&!Key_config.下.タイム){
              Key_config.下.タイム = 5;
              Choice_Number--;
              if(Choice_Number < 0) Choice_Number = Choice_Data[Datas.選択肢].length - 1;
            };

            Temp1 = JSON.stringify(Choice_Data[Datas.選択肢]);
            Temp1 = JSON.parse(Temp1);
            Temp = [];
            for(var I = 0; I < Temp1.length; I++) Temp[I] = Temp1[Temp1.length - I - 1];
            for(var I = 0; I < Temp.length; I++){
              Image[I+11].opacity = 0.5;
              if(I!=Choice_Number) ChoiceText[I]._element.textContent = Temp[I][0];
              else{
                ChoiceText[I]._element.textContent = "▶ " + Temp[I][0];
                Next_Scene = Temp[I][1];
              };
            };
          };
        };
        return;
      });

      window.addEventListener("keydown",function(e){
        if(To_Next){
          switch(e.key){
            case "c":
            Datas = Chat_Data[Next_Scene];
            Chat_Reset();
            break;
          };
        };
      });

      return scene;
    };

    switch(HTML){
      case "管理者":
        var Data_number = "データ1";
        var Body = "書き込み" + JSON.stringify(Stage_Datas);
        break;
      case "編集":
        if(window.localStorage.getItem("ローカルステージデータ")){
          Stage_Datas = window.localStorage.getItem("ローカルステージデータ");
          Stage_Datas = JSON.parse(Stage_Datas);
        }
        else Stage_Datas = {};
        var Data_number = "データ1";
        var Body = "読み込み";
        break;
      default:
        Stage_Datas = {};
        var Data_number = "データ1";
        var Body = "読み込み";
        break;
    };

    var URL = "https://script.google.com/macros/s/AKfycbw2Dx5NjCfQRv1TlpH0kSnvzvZrrLXoWI55JSpuda8XYxwEwbMd/exec";
    var Options = {
      method: "POST",
      body:JSON.stringify({Sheet_id:"13esnJ1oLnt2hvzpK6pQEJW_kVF8UkUV_u3P55zpouBM",Sheet_name:"JSON"})
    };

    fetch(URL,Options).then(res => res.json()).then(result => {
    for(var I = 0; I < result.length; I++){
      result[I] = JSON.parse(result[I].データ);
      switch(result[I].タイプ){
        case "会話":
          Chat_Data[result[I].名前] = result[I].データ;
          break;
        case "画像":
          Image_Data[result[I].名前] = result[I].データ;
          break;
        case "選択肢":
          Choice_Data[result[I].名前] = result[I].データ;
          break;
        case "音":
          Sound_Data = result[I].データ;
          break;
      };
    };

    game.replaceScene(Chat_Scene("タイトル"));
    return;
  },);
};
game.start();
};
