$(document).ready(function () {
    $(document).on("click", "#scrape-btn", (e) => {
        e.preventDefault();
        $.ajax({
            method: "GET",
            url: "/scrape",
        }).then(function (res) {
            console.log(res);
            alert("Scrape has completed.");
            window.location.assign("/");
        });
    });

    $(document).on("click", "#clear-btn", (e) => {
        e.preventDefault();
        $.ajax({
            method: "GET",
            url: "/news/remove/all",
        }).then(function (res) {
            console.log(res);
            window.location.assign("/");
        });
    });

    $(document).on("click", ".list-group-item", function (e) {
        e.preventDefault();
        $("#bookmarked-modal").modal("hide");
        $("#news-modal-title").empty();
        $("#modal-btn-wrapper").empty();
        $("#comment-btn-wrapper").empty();
        $(".news-modal-comments").empty();

        let queryURL = `/news/${$(this).attr("data-db-id")}`;
        $.ajax({
            method: "GET",
            url: queryURL
        }).then(function (res) {
            $("#news-modal-title").text(res.headline);
            if (res.bookmarked === false) {
                let bookmarkButton = $("<button>");
                bookmarkButton.attr("data-db-id", res._id);
                bookmarkButton.addClass("btn btn-dark bookmark-btn");
                bookmarkButton.text("Bookmark this article");
                $("#modal-btn-wrapper").append(bookmarkButton);
            }
            else {
                let bookmarkButton = $("<button>");
                bookmarkButton.attr("data-db-id", res._id);
                bookmarkButton.addClass("btn btn-danger remove-bookmark-btn");
                bookmarkButton.text("Remove this bookmark");
                $("#modal-btn-wrapper").append(bookmarkButton);
            }

            let viewArticle = $("<a>");
            viewArticle.addClass("btn btn-dark view-btn");
            viewArticle.attr("href", res.linkURL);
            viewArticle.attr("target", "_blank");
            viewArticle.text("View Article");
            $("#modal-btn-wrapper").append(viewArticle);


            let submitButton = $("<button>");
            submitButton.attr("data-db-id", res._id);
            submitButton.attr("id", "add-comment-btn");
            submitButton.addClass("btn btn-dark comment-btn");
            submitButton.text("Add Comment");
            $("#comment-btn-wrapper").append(submitButton);

            console.log(res);
            if (res.comments.length !== 0) {
                for (let i = 0; i < res.comments.length; i++) {
                    if (i === 0) {
                        $(".news-modal-comments").append(`<h5>Comments:</h5>`);
                    }
                    let commentDiv = $("<div>");
                    commentDiv.addClass("list-group-item list-group-item-action");
                    let commentContentWrapper = $("<div>");
                    commentContentWrapper.addClass("d-flex w-100 justify-content-left");
                    commentContentWrapper.append(`<h5 class="mb-1">${res.comments[i].username}</h5>`);
                    commentDiv.append(commentContentWrapper);
                    commentDiv.append(`<p class="mb-1">${res.comments[i].commentBody}</p>`);
                    $(".news-modal-comments").append(commentDiv);
                }
            }
        });
    });

    $(document).on("click", "#add-comment-btn", function (e) {
        e.preventDefault();

        let queryURL = `/news/${$(this).attr("data-db-id")}`;
        $.ajax({
            method: "POST",
            url: queryURL,
            data: {
                username: $("#username").val().trim(),
                commentBody: $("#add-comment-field").val().trim()
            }
        }).then(function (res) {
            console.log(res);
            $("#username").val("");
            $("#add-comment-field").val("");
            $("#news-modal").modal("hide");
        });
    });

    $(document).on("click", ".bookmark-btn", function (e) {
        e.preventDefault();
        let articleDBId = $(this).attr("data-db-id");
        let queryURL = `/news/bookmark/${articleDBId}`;
        $.ajax({
            method: "GET",
            url: queryURL,
        }).then(function (res) {
            console.log(res);
            window.location.replace("/");
        });
    });

    $(document).on("click", ".remove-bookmark-btn", function (e) {
        e.preventDefault();
        let articleDBId = $(this).attr("data-db-id");
        let queryURL = `/news/removebookmark/${articleDBId}`;
        $.ajax({
            method: "GET",
            url: queryURL,
        }).then(function (res) {
            console.log(res);
            window.location.replace("/");
        });
    });
});

