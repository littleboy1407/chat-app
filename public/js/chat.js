var queryString = window.location.search;
var userObj = $.deparam(queryString)
console.log(userObj);

var socket = io();

socket.on("connect", () => {
  socket.emit("joinroom",userObj)
})


socket.on("listUser",msg=>{
  const listUser = msg.listUser
  let olTag = $("<ol></ol>")

  listUser.forEach(user=>{
    let liTag = $("<li></li>")
    liTag.text(user.name)
    olTag.append(liTag)
  });
  $("#users").html(olTag)
})

socket.on("sendMsg", msg => {
  const template = $("#message-template").html();
  const html = Mustache.render(template, {
    from: msg.from,
    text: msg.text,
    createAt: moment(msg.createAt).format("h:mm a")
  })

  $("#messages").append(html);
})

socket.on("disconnect", () => {
  console.log("Disconnect to server")
})

$("#message-form").on("submit", (e) => {
  e.preventDefault();

  socket.emit("createMsg", {
    from: userObj.name,
    text: $("[name=message]").val()
  })
  $("[name=message]").val("")

  $('#messages').animate({
    scrollTop: $('#messages')[0].scrollHeight
  }, 100);
})

$("#sendLocation").on("click", () => {
  if (!navigator.geolocation) return alert("Your browser does not support this feature, please update")

  navigator.geolocation.getCurrentPosition(position => {

    const { latitude, longitude } = position.coords

    socket.emit("createLocation", {
      from: userObj.name,
      latitude,
      longitude
    })
  })
})

socket.on("sendLocation", (msg) => {
  let liTag = $("<li></li>")
  let aTag = $("<a>My location</a>")
  aTag.attr("href", `https://www.google.com/maps/@${msg.latitude},${msg.longitude}z`)
  aTag.attr("target", "_blank")

  liTag.append(aTag)
  $("#messages").append(liTag)
})