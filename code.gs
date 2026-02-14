function doGet(e) {
  var route = e.parameter.page || 'home';
  var template;

  if (route === 'home') {
    template = HtmlService.createTemplateFromFile('index.html');
    template.posts = getPosts();
    
  } else if (route === 'chat') {
    template = HtmlService.createTemplateFromFile('chat.html');
  } else if (route === 'games') {
    template = HtmlService.createTemplateFromFile('games.html');
  } else if (route === 'movies') {
    
    template = HtmlService.createTemplateFromFile('movies.html');
    template.videos = getVideos();

  } else if (route === 'watch') {
    var videoId = e.parameter.v;
    template = HtmlService.createTemplateFromFile('watch.html');
    template.videoData = getVideoById(videoId);

  }else {
    template = HtmlService.createTemplateFromFile('index.html');
    template.posts = getPosts();
  }

  template.url = ScriptApp.getService().getUrl();
  
  return template.evaluate()
      .setTitle('The coolest google sheets blog')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getVideos() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Videos');
  var lastRow = sheet.getLastRow();
  
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  
  return values.map(function(row) {
    return {
      id: row[0],
      titulo: row[1],
      descricao: row[2],
      capa: row[3],
      driveId: row[4]
    };
  });
}

function getVideoById(idTarget) {
  var videos = getVideos();
  for (var i = 0; i < videos.length; i++) {
    if (videos[i].id == idTarget) {
      return videos[i];
    }
  }
  return null;
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename)
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .getContent();
}

function getPosts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Posts');
  var lastRow = sheet.getLastRow();
  
  if (lastRow < 2) return [];

  var range = sheet.getRange(2, 1, lastRow - 1, 5); 
  var values = range.getValues();
  
  var posts = values.map(function(row) {
    return {
      data: row[0],    
      titulo: row[1],   
      conteudo: row[2], 
      slug: row[3],      
      img: row[4]
    };
  });
  
  return posts.reverse(); 
}


function saveChatMessage(usuario, mensagem) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ChatDB');
  sheet.appendRow([new Date(), usuario, mensagem]);
  return true;
}


function getChatHistory() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ChatDB');
  var lastRow = sheet.getLastRow();
  
  if (lastRow < 2) return [];
  
  var startRow = Math.max(2, lastRow - 19);
  var numRows = lastRow - startRow + 1;
  
  var range = sheet.getRange(startRow, 1, numRows, 3);
  var values = range.getValues();
  
  return values.map(function(row) {
    return {
      time: new Date(row[0]).toLocaleTimeString(),
      user: row[1],
      msg: row[2]
    };
  });
}
