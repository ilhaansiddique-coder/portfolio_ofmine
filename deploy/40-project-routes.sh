#!/bin/sh
set -eu

# Each line is repo-name=http://docker-service:port. Only validated origin
# URLs are accepted; values can never introduce additional Nginx directives.
route_dir=${PROJECT_ROUTES_DIR:-/etc/nginx/project-routes}
mkdir -p "$route_dir"
output=$route_dir/routes.conf
: > "$output"
printf '%s\n' "${DEMO_UPSTREAMS:-}" | while IFS='=' read -r repo upstream; do
    [ -n "$repo" ] || continue
    if ! printf '%s' "$repo" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9_-]*$'; then
        echo "Invalid project route name" >&2
        exit 1
    fi
    case "$repo" in api|projects|ilsq|demo|previews|_next)
        echo "Project route conflicts with a portfolio route: $repo" >&2
        exit 1 ;;
    esac
    if ! printf '%s' "$upstream" | grep -Eq '^https?://[A-Za-z0-9][A-Za-z0-9.-]*(:[0-9]{1,5})?$'; then
        echo "Invalid project service origin for $repo" >&2
        exit 1
    fi
    cat >> "$output" <<EOF
location = /$repo { return 308 /$repo/\$is_args\$args; }
location ^~ /$repo/ {
    resolver 127.0.0.11 valid=30s ipv6=off;
    set \$project_upstream $upstream;
    proxy_pass \$project_upstream\$request_uri;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_ssl_server_name on;
    proxy_set_header X-Forwarded-Host \$host;
    proxy_set_header X-Forwarded-Proto \$portfolio_forwarded_proto;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Prefix /$repo;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection \$connection_upgrade;
    proxy_read_timeout 3600s;
    proxy_buffering off;
}
EOF
done
