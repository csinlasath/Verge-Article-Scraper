$(document).on("click", "#scrape-btn", (e) => {
    e.preventDefault();
    window.location.replace("/scrape");
});

$(document).on("click", ".list-group-item", function(e) {
    e.preventDefault();
    $("#news-modal-title").empty();
    $("#modal-btn-wrapper").empty();
    $("#comment-btn-wrapper").empty();
    $("#news-modal-comments").empty();

    let queryURL = `/news/${$(this).attr("data-db-id")}`;
    $.ajax({
        method: "GET",
        url: queryURL
    }).then(function(res) {
        console.log(res);
        $("#news-modal-title").text(res.headline);
        let bookmarkButton = $("<button>");
        bookmarkButton.attr("data-db-id", res._id);
        bookmarkButton.addClass("btn btn-success bookmark-btn");
        bookmarkButton.text("Bookmark this article");
        $("#modal-btn-wrapper").append(bookmarkButton);

        let submitButton = $("<button>");
        submitButton.attr("data-db-id", res._id);
        submitButton.attr("id", "add-comment-btn");
        submitButton.addClass("btn btn-info comment-btn");
        submitButton.text("Add Comment");
        $("#comment-btn-wrapper").append(submitButton);
    });
});

$(document).on("click", "#add-comment-btn", function(e) {
    e.preventDefault();

    let queryURL = `/news/${$(this).attr("data-db-id")}`;
    $.ajax({
        method: "POST",
        url: queryURL,
        data: {
            username: $("#username").val().trim(),
            commentBody: $("#add-comment-field").val().trim()
        }
    }).then(function(res) {
        console.log(res);
    });

})