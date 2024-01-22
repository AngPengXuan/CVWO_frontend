import { backendLink } from "./DeploymentConfig";

export const backendLinks = {
    login: backendLink + "login",
    register: backendLink + "register",
    validate_token: backendLink + "validate_token",
    create_thread: backendLink + "api/v1/posts/create",
    show_thread: backendLink + "api/v1/show/",
    show_all_thread: backendLink + "api/v1/posts/index",
    destroy_thread: backendLink + "api/v1/destroy/",
    update_thread: backendLink + "api/v1/update/",
    create_comment: backendLink + "api/v1/comments/create",
    update_comment: backendLink + "api/v1/comment/update",
    delete_comment: backendLink + "api/v1/comment/destroy",
    update_post_rating: backendLink + "api/v1/post_rating/update",
    show_post_rating: backendLink + "api/v1/post_rating/show"
};