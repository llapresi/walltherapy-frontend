const loadDomosFromServer = (sort = '') => {
  sendAjax('GET', `/getDomos?sort=${sort}`, null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />, document.querySelector("#domos")
    );
  });
};

const handleDomo = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({width:'hide'},350);

  if($("domoName").val() == '' || $('#domoAge').val() == '' || $("domoFavFood").val()) {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
    loadDomosFromServer($('#sortSelector').val());
  });

  return false;
};

const sortSelect = (e) => {
  console.log(e.target.value);
  loadDomosFromServer(e.target.value);
};

const DomoForm = (props) => {
  return(
    <form id="domoForm"
    onSubmit={handleDomo}
    name="domoForm"
    action="/maker"
    method="POST"
    className="domoForm">
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name" />
      <label htmlFor="age">Age: </label> 
      <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
      <label htmlFor="favFood" id="domoFoodLabel">Favorite Food: </label> 
      <input id="domoFavFood" type="text" name="favFood" placeholder="Favorite Food" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
  );
};

const DomoList = function(props) {
  if(props.domos.length === 0) {
    return(
      <div className="domoList">
        <h3 className="emptyDomo">No domos yet</h3>
      </div>
    );
  }

  const domoNodes = props.domos.map(function(domo) {
    return(
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName">Name: {domo.name} </h3>
        <h3 className="domoAge">Age: {domo.age} </h3>
        <h3 className="domoFavFood">Favorite Food: {domo.favFood} </h3>
      </div>
    );
  });

  return (
    <div className="domoList">
      <select id="sortSelector" onChange={sortSelect}>
        <option value="dateAscending">Most Recent (Ascending)</option>
        <option value="dateDescending">Most Recent (Desending)</option>
        <option value="nameAscending">Name (A-Z)</option>
        <option value="nameDescending">Name (Z-A)</option>
        <option value="foodAscending">Favorite Food (A-Z)</option>
        <option value="foodDescending">Favorite Food (Z-A)</option>
        <option value="ageAscending">Age (Ascending)</option>
        <option value="ageDescending">Age (Desending)</option>
      </select>
      {domoNodes}
    </div>
  );
};

const setup = (csrf) => {
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );

  ReactDOM.render(
    <DomoList domos={[]} />, document.querySelector("#domos")
  );

  loadDomosFromServer();
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});