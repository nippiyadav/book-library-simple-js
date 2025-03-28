// dom selection

const searchValue = document.getElementById("searching");
const searchBtn = document.getElementById("searching-btn");

const grid = document.getElementById("grid");
const list = document.getElementById("list");

const sort = document.getElementsByClassName("sort");
const aToZ = document.getElementById("author");
const year = document.getElementById("year");

const increase_page = document.getElementById("increase_page");
const decrease_page = document.getElementById("decrease_page");
const pagination = document.querySelector(".pagination");

const book_container = document.getElementById("book-container");
// demo data for showing

// if not present class then it will throw a null value
const real_book_shawer = document.querySelector(".real-book-shawer");

let demo = [];


// this function does making element div, through looping, till length of array
const libraryBookInsertingFn = function (data) {
    // dugging pupose
    // console.log(data);

    data.map((data, index) => {
        const newDiv = document.createElement("div");
        newDiv.classList = "real-book-shawer"

        const new_nested_div = `
            <div class="image-div">
                <a href=${data.infoLink} target="_blank">
                    <img src=${data.image} alt="" >
                </a>
            </div>
            <div class="basic-info-container">
                <div class="book-shawer-meta">
                    <a href=${data.infoLink} target="_blank">
                        <h1 class="title">${data.title}</h1>
                    </a>
                    <h2 class="author"><span>Authors</span>:- ${data.author.join("\n")}</h2>
                </div>
                <div class="book-shawer-meta">
                    <h3 class="publisher"><span>Publisher</span>:- ${data.publisher}</h3>
                    <h4 class="published-date"><span>Published Date:- </span>:- ${data.publised_date}</h4>
                </div>
            </div>`
        newDiv.innerHTML = new_nested_div;

        book_container.append(newDiv)
    })
}



// this is the methods of list and grid
list.addEventListener("click", viewingChange);
grid.addEventListener("click", viewingChange);

function viewingChange(e) {
    console.log(e.target.innerText);
    if (e.target.innerText === "List") {
        book_container.style.gridTemplateColumns = "repeat(1, 1fr)"
    } else {
        console.log("else condition");

        if (window.innerWidth <= 444) {
            book_container.style.gridTemplateColumns = "repeat(1, 1fr)"

        } else if (window.innerWidth <= 720) {
            book_container.style.gridTemplateColumns = "repeat(2, 150px)"
        }
        else {
            book_container.style.gridTemplateColumns = "repeat(4, 150px)"
        }

    }
}



// sorting methods is being used for filter on the basis of title A-Z and date of published
let copyArr = [...demo]

year.addEventListener("click", sortingFun);
aToZ.addEventListener("click", sortingFun);

function sortingFun(e) {

    let yearChecked = year.checked;
    let atozChecked = aToZ.checked;

    // debugging pupose
    // console.log("Year:- ", yearChecked, "\n",
    //     "AtoZ:- ", atozChecked
    // );

    if (yearChecked && atozChecked) {
        copyArr.sort((a, b) => {
            const Value_A = Number(a.publised_date.slice(0, 4));
            const Value_B = Number(b.publised_date.slice(0, 4));
            return Value_A - Value_B
        });

        // debugging purpose
        // console.log("first if function");

        book_container.innerHTML = "";
        libraryBookInsertingFn(copyArr);

    } else if (yearChecked && atozChecked !== true) {
        copyArr.sort((a, b) => {
            const Value_A = Number(a.publised_date.slice(0, 4));
            const Value_B = Number(b.publised_date.slice(0, 4));
            return Value_A - Value_B
        });

        // debugging purpose
        // console.log("yearcheck but atoz not checked");

        book_container.innerHTML = "";
        libraryBookInsertingFn(copyArr);

    } else if (atozChecked && yearChecked !== true) {
        copyArr.sort((a, b) => {
            const Value_A = a.title.toLowerCase().localeCompare(b.title.toLowerCase());
            console.log("b".localeCompare("a"));

            return Value_A
        })
        // debugging purpose
        // console.log("atozchecked but year not checked");

        book_container.innerHTML = "";
        libraryBookInsertingFn(copyArr);

    } else {
        // debugging purpose
        // console.log("both not checked");

        book_container.innerHTML = "";
        libraryBookInsertingFn(demo);
    }
}



// filtering Methods is being used for filtering data of current page on the basis of what input is being given on the input search, 
searchValue.addEventListener("input", searchingValue)

function searchingValue(e) {
    let searchValue = e.target.value.trim()
    if (searchValue !== "") {
        const arrayFilter = copyArr.filter((data, index) => {
            return data.title.toLowerCase().includes(searchValue) || data.author.join("").toLowerCase().includes(searchValue)
        });

        // debugging purpose
        // console.log("no value in the search value", arrayFilter);

        book_container.innerHTML = "";
        libraryBookInsertingFn(arrayFilter);

    } else {
        // debugging purpose
        // console.log("no value in the search value", demo);

        book_container.innerHTML = "";
        libraryBookInsertingFn(demo);
    }

}


// fetching data from the url, document first time is loaded
document.addEventListener("DOMContentLoaded", fetchingData("1"));

// this function fetch the data from the api on the basis of page, it is universal so i created this
async function fetchingData(page) {
    let page_num = page ?? 1
    const url = `https://api.freeapi.app/api/v1/public/books?page=${page}&limit=10`;
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        const realData = data.data.data;
        const newOnlyNeccessaryData = realData.map((data, index) => {
            const modifiedObj = {
                image: data.volumeInfo.imageLinks.thumbnail,
                title: data.volumeInfo.title,
                author: data.volumeInfo.authors ?? [],
                publisher: data.volumeInfo.publisher,
                publised_date: data.volumeInfo?.publishedDate ? data.volumeInfo?.publishedDate?.slice(0, 4) : undefined,
                infoLink: data.volumeInfo.infoLink,
            };
            return modifiedObj
        });
        console.log("newOnlyNeccessaryData:- ", newOnlyNeccessaryData);


        demo.push(...newOnlyNeccessaryData);
        book_container.innerHTML = "";
        copyArr = [...newOnlyNeccessaryData]
        libraryBookInsertingFn(newOnlyNeccessaryData)
    } catch (error) {
        console.error(error);
    }
}



// pagination function which update the textcontent on the basis of click of increase and decrease button
// increase
increase_page.addEventListener("click", (e) => {

    // debugging purpose
    // console.log(pagination.children[1].textContent);
    // console.log(pagination.children[2].textContent);
    // console.log(pagination.children[3].textContent);  

    for (let i = 1; i <= 3; i++) {
        console.log(pagination.children[i].textContent);

        pagination.children[i].textContent = Number(pagination.children[i].textContent) + 1
    };

    // debugging purpose
    // console.log("new data:- ", pagination.children[1].textContent);

    demo = []
    fetchingData(pagination.children[1].textContent)

})

decrease_page.addEventListener("click", (e) => {
    if (Number(pagination.children[1].textContent) === 1 || Number(pagination.children[1].textContent) <= 0) {
        return;
    } else {

        for (let i = 1; i <= 3; i++) {
            console.log(pagination.children[i].textContent);

            pagination.children[i].textContent = Number(pagination.children[i].textContent) - 1
        }

        // debugging purpose
        // console.log("new data:- ", pagination.children[1].textContent);

        demo = []
        fetchingData(pagination.children[1].textContent)
    }
})

