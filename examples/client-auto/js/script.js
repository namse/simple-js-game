!function(window){
  var RobotClient = Client = {
    socket : io.connect(),

    $target : $("#target"),
    $name : $("#name"),
    $usersData : $("#users-data"),
    $container : $("#container"),

    x : null,
    y : null,
    radius : null,
    isRunAuto : false,

    isSetStatusPanel : true,

    startRunning : function(){
      this.isRunAuto = true;
      this.$target.click();
      return true;
    },
    stopRunning : function(){
      return this.isRunAuto = false;
    },

    drawTarget : function(x, y, radius){
      if(!x || !y || !radius){
        if(!this.x || !this.y || !this.radius)
          return false;
        x = this.x;
        y = this.y;
        radius = this.radius;
      }else{
        this.x = x;
        this.y = y;
        this.radius = radius;
      }

      var height = Client.$container.height();
      var width = Client.$container.width();

      Client.$target.show()
        .offset({
          top: height * (y - radius) / 100,
          left: width * (x - radius) / 100
        })
        .width(radius * 2 * width / 100)
        .height(radius * 2 * height / 100);

      return true;
    },
    removeTarget : function(){
      this.$target.hide();
    },

    init : function(cb){
      if($(document).find('#status-panel').length == 0){
        $('body').append("<div id='status-panel'></div>");
        this.$statusPanel = $("#status-panel");
      }

      Client.socket.off('broadcast');
      Client.socket.on('broadcast', function(packet) {
        var value = '';

        Client.totalScore = 0;
        Client.$statusPanel.html("");

        packet.usersData.forEach(function(userData){
          Client.totalScore += parseInt(userData.score);
        });

        packet.usersData.forEach(function(userData) {
          var userName = userData.name,
              userScore = parseInt(userData.score),
              userScoreRate = userScore?Math.floor(userScore/Client.totalScore*100):0;

          value += userName + ' : ' + userScore + '\n';

          /*!
          * 상태 패널 추가 - 점수 비율 시각화
          */
          if(Client.isSetStatusPanel && userName && userScoreRate){
            /*!
            * 색상은 패킷 날아올때마다 변경(별 의미 없음)
            */
            var r = Math.floor(Math.random()*255);
            var g = Math.floor(Math.random()*255);
            var b = Math.floor(Math.random()*255);

            var textColor = 'black';
            var rgb = r+g+b;

            /*!
            * RGB 합계 값이 400 이하면 어두운 색일 가능성이 크므로 따라서 흰색 글씨
            */
            if(rgb < 400){
              textColor = 'white';
            }
            if(userName){
              Client.$statusPanel.append("<div id='"+userName+"-user-data' class='user-data'></div>");
              
              var $userData = $("#"+userName+"-user-data");

              $userData.css({
                background: "rgb("+r+","+g+","+b+")",
                color: textColor,
                fontSize: "11px",
                whiteSpace: "nowrap",
                textAlign: "center",
                position:"relative",
                height:"20px",
                width:userScoreRate+"%"
              });

              $userData.html(userScoreRate+"%");
              $userData.append("<span>"+userName+" : "+userScore+"</span>");
            }
          }
        });

        Client.$usersData.html(value.replace(/\n/g,"<br />"));
        
        if(packet.target) {
          var target = packet.target;

          Client.drawTarget(target.x, target.y, target.radius);

          if(Client.isRunAuto)
            Client.$target.click();
        } else {
          Client.removeTarget();
        }
      });

      Client.$name.off('change');
      Client.$name.change(function(){
        var name = $(this).val();
        Client.socket.emit('setName', {
          name,
        });
      });

      Client.$target.off('click');
      Client.$target.click(function(e) {
        if(Client.isRunAuto){
          var x = Client.x;
          var y = Client.y;
        }else{
          var height = Client.$container.height();
          var width = Client.$container.width();
          var x = e.clientX  / width * 100;
          var y = e.clientY / height * 100;
        }
        console.log(x, y);
        Client.socket.emit('hit', {
          x,
          y,
        });
      });

      $(window).on('resize', function(){
        Client.drawTarget();
      });

      if(typeof cb == 'function')
        cb();
    }
  }
  window.RobotClient = window.Client = RobotClient;
}(window);

Client.init();