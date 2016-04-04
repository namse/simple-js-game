/js/script.js

window.RobotClient 혹은 window.Client 객체는 동일함.

Client.init(callback) 메서드는 모든 이벤트를 해제하고 재 설정한다.

Client.startRunning() 메서드는 클라이언트가 알아서 동작하게 한다.

Client.stopRunning() 메서드는 클라이언트의 동작을 멈춘다.

Client.drawTarget(x, y, radius) 메서드는 타겟 오브젝트를 화면에 그린다. (인자가 없으면 Client 객체 내부의 x, y, radius 프로퍼티를 참조하며, 객체 내부의 x, y, radius 프로퍼티가 null일 경우 아무것도 그리지 않고 false를 리턴한다.)

Client.removeTarget() 메서드는 타겟 오브젝트를 화면에서 지운다.

isSetStatusPanel 프로퍼티는 상태 패널을 화면에 그릴 것인지의 여부를 지정한다. 기본값은 true이다.
